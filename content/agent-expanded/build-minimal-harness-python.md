---
id: "A24"
title: "用 Python 搭一个最小 Harness：五模块可运行骨架"
slug: "build-minimal-harness-python"
series: "工程实践"
audience: "有 Python 基础的 Agent 初学者"
thesis: "最小 Harness 只需五个可替换模块，先用可运行骨架固定契约，再逐层加能力。"
keywords: ["Python", "最小实现", "模块化", "工具注册", "可测试"]
harness: true
superagent: false
word_count: 3503
status: draft
---


## 一、开场问题：第一个版本总是写成一团

很多人写第一个 Agent，是从一个 while 循环开始的：拼提示词、调模型、解析工具名、执行函数、把结果塞回消息列表，直到模型说“结束”或者步数用完。一百多行，能跑通，演示效果也不错。等到要加第二个工具、换一个模型、记录一次失败，代码开始互相纠缠：解析逻辑散在循环里，工具定义与调用混在一起，出错时只能打印一大段 JSON 自己看。

问题不在于代码写得不好，而在于没有先把“契约”固定下来。本文用 Python 搭一个最小的 Harness，只保留五个模块：主循环、工具注册表、上下文装配、状态存储、日志记录。每个模块先定接口，再写实现；实现可以很简陋，但替换其中任何一个都不应该牵动其他四个。

## 二、概念界定：五个模块与它们的边界

主循环负责“推进”：读状态、问模型、执行动作、写状态、判断终止。它不负责拼提示词，也不负责知道工具怎么实现。工具注册表负责“有什么可做”：登记工具的名称、参数 schema、执行函数与副作用等级。上下文装配负责“模型看到什么”：把系统规则、任务、历史与检索结果按预算拼成消息。状态存储负责“记住什么”：保存会话、步骤与中间产物。日志记录负责“留下什么”：把每一步的输入、决策、结果与耗时写成可回放的轨迹。

五个模块之间只通过数据结构通信，不通过全局变量。主循环拿到的是“模型返回的决策对象”，而不是原始 JSON 字符串；工具注册表返回的是“统一的结果外壳”，而不是各工具自己的返回值。把这两处统一，后面的替换与测试都会容易很多。

接口先于实现，意思是先用 Protocol 或抽象基类把方法签名写下来，再写一个能跑的最小实现。这样即使第一版用的是假模型、假工具，主循环也能端到端跑通，测试可以在没有网络的情况下进行。

## 三、机制拆解：可运行骨架

先定义两个最关键的协议：模型客户端与工具。模型客户端只暴露一个 decide 方法，输入是消息与工具声明，输出是决策对象；工具只暴露 name、schema 与 run。

```python
from dataclasses import dataclass, field
from typing import Any, Protocol

@dataclass
class Decision:
    kind: str                  # "tool" | "finish" | "ask_human"
    tool: str | None = None
    args: dict[str, Any] = field(default_factory=dict)
    answer: str | None = None
    reason: str = ""

@dataclass
class ToolResult:
    ok: bool
    data: Any = None
    error: dict | None = None  # {"code": ..., "message": ..., "retryable": bool}

class ModelClient(Protocol):
    def decide(self, messages: list[dict], tools: list[dict]) -> Decision: ...

class Tool(Protocol):
    name: str
    schema: dict
    side_effect: str           # "read" | "write" | "irreversible"
    def run(self, **kwargs) -> ToolResult: ...
```

接着是注册表与状态存储。注册表要拒绝重名，并在启动时校验 schema 的必填字段；状态存储要只追加，不覆盖历史。

```python
class ToolRegistry:
    def __init__(self) -> None:
        self._tools: dict[str, Tool] = {}

    def register(self, tool: Tool) -> None:
        if tool.name in self._tools:
            raise ValueError(f"duplicate tool: {tool.name}")
        self._tools[tool.name] = tool

    def specs(self) -> list[dict]:
        return [{"name": t.name, "schema": t.schema,
                 "side_effect": t.side_effect} for t in self._tools.values()]

    def call(self, name: str, args: dict) -> ToolResult:
        tool = self._tools.get(name)
        if tool is None:
            return ToolResult(False, error={"code": "unknown_tool",
                                            "message": name, "retryable": False})
        try:
            return tool.run(**args)
        except TypeError as exc:
            return ToolResult(False, error={"code": "bad_args",
                                            "message": str(exc), "retryable": True})

class StateStore:
    def __init__(self, path: str) -> None:
        self.path = path
        self.events: list[dict] = []

    def append(self, event: dict) -> None:
        self.events.append(event)          # 生产环境应落盘并带序号

    def snapshot(self) -> dict:
        return {"events": list(self.events)}
```

最后是主循环。它只做四件事：装配上下文、取决策、执行、记录。终止条件由运行时代码判断，而不是等模型说“结束”。

```python
def run(goal, model, registry, store, tracer, max_steps=12):
    for step in range(max_steps):
        messages = build_context(goal, store.snapshot())
        decision = model.decide(messages, registry.specs())
        tracer.log(step, decision)
        if decision.kind == "finish":
            store.append({"type": "finish", "answer": decision.answer})
            return decision.answer
        if decision.kind == "ask_human":
            return {"status": "suspended", "question": decision.reason}
        result = registry.call(decision.tool, decision.args)
        store.append({"type": "tool", "name": decision.tool,
                      "args": decision.args, "result": result})
        if not result.ok and not result.error.get("retryable"):
            break
    return {"status": "incomplete", "events": store.snapshot()["events"]}
```

这段骨架只有几十行，但它把三件事固定了下来：模型只输出决策，工具只返回统一外壳，状态只追加事件。后面要加权限、加预算、加重试，都是在这三处上加，而不是重写循环。

上下文装配这一层最容易被写成一行字符串拼接，但它其实决定了模型每一步看到什么。最小实现里可以只做三件事：把系统规则放在最前面且只放一次；把最近若干轮事件按时间顺序放入，超出预算就从最旧的开始丢；在末尾复述一次当前目标与尚未满足的约束。第三件事看着多余，实际很关键——长会话里模型最容易忘记“为什么开始”，而复述目标的成本只有一行字。

状态存储的最小实现是内存里的事件列表，但它已经具备两个重要性质：事件有序、只追加。有序让回放可以按步重演，只追加让“谁在什么时候改了什么”可以被追溯。等到要落盘时，只需要把 append 换成带序号的文件写入，其他模块不受影响。

日志记录这一层在骨架阶段可以只用标准输出，但字段要一次定好：步号、模型输入摘要、决策类型、工具名与参数、结果状态、耗时。字段定好之后，接任何轨迹查看器都只是格式转换，而不是重新埋点。

光有原则不够，装配值得单独给一段实现。最小版本只做三件事：规则只放一次、事件从最新往回装、末尾复述目标。从最新往回装是为了超预算时保住近期信息，装完再翻回时间顺序，避免模型读到逆序对话。

```python
SYSTEM_RULES = "只使用给定工具；不确定时提问，不要编造。"

def render_event(event: dict) -> str:
    kind = event.get("type")
    if kind == "tool":
        return f"[{event['name']}] {event['args']} -> ok={event['result'].ok}"
    if kind == "finish":
        return f"[finish] {event.get('answer', '')}"
    return f"[{kind}] {event}"

def build_context(goal: str, snapshot: dict, budget_chars: int = 6000) -> list[dict]:
    kept: list[dict] = []
    used = 0
    for event in reversed(snapshot["events"]):     # 从最新往回装
        line = render_event(event)
        if used + len(line) > budget_chars:        # 超预算就停，不截断单条
            break
        kept.append({"role": "user", "content": line})
        used += len(line)
    kept.reverse()                                 # 翻回时间顺序
    return ([{"role": "system", "content": SYSTEM_RULES}]
            + kept
            + [{"role": "user", "content": f"当前目标：{goal}"}])
```

这段实现刻意不做摘要：摘要会引入新的失真，本身也要花 token。等预算真的压不住时再加，而那时的替换点只有这一个函数，主循环不用动。

状态存储还有一个容易忽略的细节：事件里要存工具返回了什么，而不只是模型说了什么。很多骨架只把模型消息写进历史，回放时看到的是模型的转述，工具真实返回的错误码已经丢了，排查时对不上。

日志的耗时字段也要分段：模型调用、工具执行、上下文装配各记一段。只记总耗时时，优化方向只能靠猜；分段之后，多数性能问题会自己指向某一层。

注册表还值得加一道启动校验：schema 的必填字段存在、side_effect 取值合法、工具名符合命名规范。这类校验在启动时做的代价是一次遍历，放到运行时做的代价是一次线上事故。

## 四、工程取舍与反例

第一个取舍是抽象程度。抽象太少，替换模型要改循环；抽象太多，一个简单任务要穿过五层接口。初学者的合理做法是“只抽象会变的部分”：模型、工具、存储是确定会换的，日志可以先写死，上下文装配可以先简单拼接。

第二个取舍是同步与异步。骨架用同步最直观，但真实工具调用多为网络请求，串行会拖长延迟。可行的路径是先同步跑通，再把工具执行改成异步，接口从 run 改为 async run，其余不动。一开始就上异步，会让错误处理与调试复杂很多。

第三个取舍是真模型与假模型。开发期用假模型能把循环、状态、日志全部测到，且不花钱、不受网络影响；接真模型是最后一步。很多团队反过来，先接真模型，结果每次调试都要等网络，失败原因也难以区分是循环错还是模型错。

反例有三类。其一是“循环里塞一切”：解析、重试、权限、日志全写在 while 里，加一个功能要改五处。其二是“工具返回值不统一”：有的返回字符串，有的返回字典，有的抛异常，主循环不得不为每个工具写分支。其三是“状态只存消息列表”：看起来简单，但无法区分“模型说了什么”与“工具真的做了什么”，回放时对不上。

还有一个常见反例是“过早优化提示词”。骨架还没跑通，就先花几天调系统提示，结果每次改循环都要重调。正确的顺序是先把契约固定、把失败路径跑通，再在稳定的骨架上做提示优化。

骨架阶段就应该配上失败注入。用假模型与假工具构造四类场景：工具抛异常、工具返回空结果、工具超时、模型连续给出同一个动作。每一类都写成一个测试用例，断言主循环在若干步内终止，并把明确的失败状态返回给调用方。这组用例不会让功能变多，但能防止后面加预算、加重试时把终止逻辑改坏。它们的运行不需要网络，几秒钟就能跑完，适合放进每次提交的检查里。

测试还有一个便宜的收益点：把每次真实运行的轨迹脱敏后存下来，当作回归用例。真实轨迹里的失败形态往往比人造用例更刁钻，尤其是参数错误与空结果两类；用假模型重放这些轨迹，能在不花钱的前提下验证循环的终止与错误处理。

骨架阶段还要拒绝一种诱惑：提前把多代理塞进来。派发子任务、汇总结果、验收复核这些都可以等单循环稳定之后再长出来；提前加进来等于在契约还没固定时又加一层不确定性，调试时连问题出在循环还是出在派发都分不清。

## 五、工程案例：一次失败

（示意场景）骨架跑通后接第一个真实检索工具。假模型下所有用例通过，接真模型后出现空转：模型连续 10 步调用同一个工具、参数完全相同，每次返回空结果；循环靠 max_steps=12 终止，返回 incomplete，但调用方拿到的状态里没有原因，前端一直显示“处理中”直到超时。

排查只能人工数日志：有步号、有工具名，但没有“这次动作与上次是否相同”的信息。三条改法——循环里加重复动作检测（同工具加同参数连续 3 次判 stuck，提前终止并给原因）；incomplete 返回结构化原因（reason、last_step、suggestion）；假模型脚本里补一条“重复动作”用例。

```python
def is_stuck(store, window: int = 3) -> bool:
    tail = store.snapshot()["events"][-window:]
    sigs = {(e.get("name"), repr(sorted(e.get("args", {}).items())))
            for e in tail if e.get("type") == "tool"}
    return len(tail) == window and len(sigs) == 1
```

修复后（示意）同一故障从 12 步空转降到 4 步终止，返回里带“检索无结果，建议放宽查询条件”。

## 六、指标怎么定

骨架阶段的指标不该是“任务成功率”，样本太少且任务太杂。可测的是循环本身的行为。

五个指标：终止率（在 max_steps 内结束的运行占比，偏低说明循环或工具契约有问题）；平均步数（按任务类型看，突然升高通常意味着工具返回格式变了或上下文丢了信息）；工具错误率（按错误码分，bad_args 高说明模型对 schema 理解不足，unknown_tool 高说明工具声明与模型认知不一致）；上下文超预算率（装配时被截断的运行占比）；失败注入覆盖率（四类失败场景中有测试的比例）。

这些指标都能从轨迹里直接算出来，不需要额外埋点，前提是日志字段一次定好。

阈值不必精确，先设一条“明显不对”的线，比如终止率低于 90% 就人工看几条轨迹。骨架阶段的指标用途是发现问题，不是考核。

## 七、落地检查清单

1. 五模块只通过数据结构通信。判据：主循环不 import 任何模型 SDK，也没有全局注册表。
2. 模型只返回决策对象。判据：解析逻辑只存在于适配器，循环里搜不到 json.loads。
3. 工具统一结果外壳。判据：所有工具返回 ToolResult，无裸字符串、无异常上抛。
4. 错误码可区分。判据：unknown_tool 与 bad_args 两类用例存在，且分别断言 retryable 取值。
5. 状态只追加不覆盖。判据：StateStore 没有 update 与 delete 方法，回放能按步重演。
6. 终止条件在运行时代码里。判据：max_steps 与 stuck 检测都有测试，终止不依赖模型说“结束”。
7. 上下文有预算与目标复述。判据：超长会话下装配结果不超预算，末尾一行包含当前目标。
8. 日志字段一次定好。判据：步号、决策类型、工具名与参数、结果状态、耗时五项齐全。
9. 失败注入可离线跑。判据：工具抛异常、空结果、超时、重复动作四类用例在无网络下数秒完成。

## 八、常见误区与面试追问

**问：骨架要不要一开始就上异步？**
答：先同步。异步把错误处理与调试复杂度抬高一个量级；真要改，接口从 run 换成 async run，其余模块不动。

**问：抽象到什么程度算够？**
答：只抽象确定会换的：模型、工具、存储。日志与上下文装配可以先写死，等第二遍重构再抽。

**问：先接真模型还是先写假模型？**
答：先写假模型。循环、状态、终止逻辑的 bug 与模型行为混在一起时，排查成本最高；假模型能把这两类问题分开。

**问：工具能不能直接返回字符串？**
答：不能。主循环就得为每个工具写分支，等于把刚固定下来的契约拆掉，错误处理也会散到各处。

**问：提示词什么时候调？**
答：契约稳定、失败路径跑通之后。骨架还在改的时候调提示，每改一次循环都要重调一遍，前面的工作全部作废。

## 九、小结与延伸阅读

最小 Harness 的价值不在代码量，而在它固定了五组契约：模型如何给决策、工具如何返回结果、上下文如何装配、状态如何追加、轨迹如何记录。契约稳定之后，加权限、加预算、加多租户都只是在这五处上扩展，而不是推倒重来。

延伸阅读建议：官方文档类可看 Python 的 Protocol、dataclass 与 asyncio 用法；开源仓库类可看极简 agent 实现的结构，只看模块划分不抄代码；工程博客类可看“自己写一个 agent 循环”的教学文章，重点对照它的终止条件与错误处理。
