# 2025科协暑培 · Unity（欧阳霄, BV1L9YmztEEm）

## 定位
游戏 track 入门第一讲：从"什么是 3D 图像引擎"到 Unity 界面操作，再到亲手做一个 WASD 控制小球躲避障碍、相机跟随的"低配版滚动的天空"。零基础友好、不深挖，适合建立 GameObject/Component 心智模型；想深入可回看 23/24 年暑培。

## 知识整理

### 3D 引擎与 Unity 选型
3D 引擎的六大核心功能：渲染、物理模拟、光照与阴影、动画、材质与纹理、相机系统；应用不限于游戏，也覆盖电影特效与 VR/AR。想深入图形学可看网课 GAMES101，清华也有老师开图形学课，大二可听。
选 Unity 而非 Unreal 的理由：编码/渲染/跨平台难度都远低于 Unreal，最适合新人——原神、王者荣耀、绝区零均为 Unity 开发；此外编辑器强、生态好、跨平台。安装走 Unity Hub→注册拿许可证→装本体→新建 3D 项目（Built-in Render Pipeline 模板即可），建议取消勾选自带的版本管理（类似自带 git 但不好用）。

### 界面布局与 Scene 操作
五大窗口：顶部是播放/暂停/单步调试；左侧 Hierarchy（层次视图）、中间 Scene（图形化场景）、右侧 Inspector（属性）、下方 Project（资源管理器，存 C# 脚本、Shader、Scene、Material）；Game 窗口显示相机实际画面。Scene 视角操作：右键转、中键拖、滚轮缩放。

### GameObject / Component 心智模型
GameObject 是场景中的可交互对象，Component 决定它的全部功能：除名称/tag/layer 外，每个对象都有 Transform（position/rotation/scale）；Main Camera 挂着 Camera+Audio Listener，把组件换成 Light 它就变成光源。
查组件是快速了解 Unity 的手段：Cube 默认带 Mesh Filter（给三维网格形状）、Mesh Renderer（负责渲染，关掉则 Game 视角不可见）、Box Collider（碰撞器，关掉就穿模）。由此得出本讲最重要的结论：Play 后小球不动，是因为缺 Rigidbody 刚体组件——加了才遵循物理；穿模则是 Collider 被误关。
更深一层，界面是代码的"数字孪生"：每个 GameObject 对应 GameObject 类实例、每个 Component 对应一个类，一一映射。Unity 开发的主要工序，就是给每个 GameObject 设计不同的 Component，自定义功能以脚本形式存在。

### 脚本：MonoBehaviour 与生命周期
Add Component→New Script 建脚本，模板继承 MonoBehaviour（Unity 脚本基类）：Start 在首帧前调用一次，负责初始化；Update 每帧调用，相当于主循环。`Debug.Log` 输出到 Console——放 Start 打一次、放 Update 每帧打，就是 hello world。
public 字段会显示在 Inspector 里、可拖拽引用并实时调试，private 不可；`GetComponent<T>()` 取组件；position 是 Vector3（XYZ 三元组）；this.gameObject 取脚本挂载的对象。同一脚本挂到多个对象（如小球和地面）就各自独立执行；"找对象"的复杂性被框架抽离，因为运行时是动态环境，可能生成成百上千个物体。

### 小球案例：物理、输入与碰撞事件
`Rigidbody.AddForce` 施力（如 (0,15,0) 让小球飞天），Vector3.up 等预设方向等价 (0,1,0)。`Input.GetKey` 读键位、按住持续为 true，配 if 处理 WASD 即实现移动；小球容易翻滚，新建 Physics Material 把 friction 与弹性都调 0 即可。
碰撞检测不用自己轮询：`OnCollisionEnter` 是碰撞发生时被系统回调的 event function，参数 Collision 携带碰撞点/冲量/对方 collider；同类还有 OnEnable/OnDestroy 等。判负有两种写法：`AddForce(velocity, ForceMode.VelocityChange)` 强制速度归零，或 `GetComponent<PlayerMove>().enabled=false` 禁用操控组件。注意撞地也会触发碰撞，所以要给障碍物加 Tag 并用 `CompareTag` 判断（比字符串比较快），只撞障碍物才判负。

### 材质、Prefab 与关卡搭建
Unity 坐标系 Y 朝上、X/Z 构成地面：把 Cube 的 X/Z 拉大、Y 调小即成地面。Material 调 Albedo 颜色、metallic、smoothness 可做出"粉色磨砂金属"，拖到物体即应用（Ctrl+Z 撤销）；自定义材质会替换 default material。
Prefab 预制体：把 GameObject 拖进 Assets 即成模板，改 prefab 属性所有实例同步（类比 Word 母版）；用 Ctrl+D 复制、按 Ctrl 贴网格移动、切正交视角摆位更准，批量摆障碍即可搭关卡。氛围上，Camera 清除方式改 Solid Color 有街机感，Window→Rendering→Lighting→Environment 加 Fog（0.03 左右）让远方渐显。

### 相机跟随与完整工作流
相机跟随是典型的组件协作：新建 FollowPlayer 挂到 Main Camera，`public Vector3 offset` 定义固定偏差（public 为在 Inspector 实时调，调至 (0,3,-20) 左右即俯视跟随视角）；Start 里 `GameObject.Find("Player")` + GetComponent 拿双方 Transform，Update 里 `position = player.position + offset`。
全流程串联起来：界面→建物体→材质→脚本→prefab→环境氛围，就是一个完整的小游戏工作流；后续课程讲高阶用法与渲染。

## 勘误对照

| 转写 | 应为 |
|---|---|
| 鼠培/属培 | 暑培 |
| writer | Rider（JetBrains IDE） |
| motor behavior/model behavior/鸡肋 | MonoBehaviour（基类） |
| REGIBODY/raid body/raidbody | Rigidbody（刚体） |
| ALBEDO/ABEL | Albedo |
| vector three or art | Vector3.up（存疑） |
| on collection enter/on tilation enter | OnCollisionEnter |
| compare tab | CompareTag |
| prefect/prefabricated | Prefab（prefabricated object） |
| 天空河 | 天空盒（Skybox） |
| 点击Q | 点击 Cube |
| SHML/HML/线描 | HTML |
| game arget | GameObject |
| debug Dot log | Debug.Log |

## 编者补充

- 编者补充（跨集联系）：Component 思维与 django 讲的 MTV"各司其职"同构；讲师提到 23/24 年暑培有更深的 Unity 内容，可作为续看路线。
- 编者补充（行动线）：装 Unity Hub→跟做完本讲小游戏→把"失败重开一局"与"计分 UI"作为练习补全。
- 编者补充（缺口）：Animator、UI 系统、新 Input System 未涉及；"Unity 是多线程"为口误表述，听时注意。
