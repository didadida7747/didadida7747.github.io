# 2025科协暑培 · Unity（欧阳霄, BV1L9YmztEEm, 约 83 分钟）

## 定位
游戏 track 入门第一讲：从"什么是 3D 图像引擎"到 Unity 界面操作，再到亲手做一个 WASD 控制小球躲避障碍、相机跟随的"低配版滚动的天空"。零基础友好、不深挖，适合建立 GameObject/Component 心智模型；想深入可回看 23/24 年暑培。

## 内容脉络

- [0:01] 讲师 G34 班欧阳霄；三部分：Unity 是什么→界面操作→场景搭建与编码，目标是低配版《滚动的天空》。⏭️可跳过：开场可 2 倍速。
- [0:59] 3D 引擎六大核心功能：渲染、物理模拟、光照与阴影、动画、材质与纹理、相机系统；应用覆盖游戏/电影特效/VR/AR。
- [3:25] 深入图形学推荐网课 GAMES101；清华胡世民院士（转写如此，存疑应为胡事民）也开图形学课，大二可听。
- [3:54] 选 Unity 而非 Unreal：编码/渲染/平台难度远低于 Unreal，最适合新人；原神、王者荣耀、绝区零都是 Unity 开发；另有跨平台、编辑器强、生态好等优点。
- [4:49] 安装：官网下 Unity Hub→注册拿许可证→装本体→新建 3D 项目（Built-in Render Pipeline 模板即可）；建议取消勾选 Unity 自带版本管理（类似自带 git 但不好用）。⏭️可跳过：装过可直接看 6:15。
- [6:44] 五大窗口：上播放/暂停/单步调试；左 Hierarchy（层次视图）、中 Scene（图形化场景）、右 Inspector（属性）、下 Project（资源管理器）；Game 窗口显示相机实际画面。Scene 视角：右键转、中键拖、滚轮缩放。
- [8:38] 核心概念：GameObject 是场景中可交互对象；Component 决定其全部功能——除名称/tag/layer 外人人都有 Transform（position/rotation/scale）；Main Camera 挂 Camera+Audio Listener，把组件换成 Light 它就变光源。
- [13:56] Project 窗口存 C# 脚本、Shader、Scene、Material。⏭️可跳过：与资源管理器直觉一致。
- [14:53] 实操起步：Cube 拉扁做地面；查组件是快速了解 Unity 的手段——Mesh Filter 给三维网格形状、Mesh Renderer 负责渲染（关掉 Game 视角不可见）、Box Collider 碰撞器（关掉就穿模）。
- [17:14] Unity 坐标系 Y 朝上、X/Z 构成地面；把 Cube 的 X/Z 拉大、Y 调小即成地面。
- [19:12] Material 调 Albedo 颜色、metallic、smoothness 做出"粉色磨砂金属"，拖到物体即应用；Ctrl+Z 撤销；自定义材质会替换 default material。
- [22:31] 按 Play 后小球不动/穿模：功能完全由 Component 决定——加 Rigidbody 刚体组件才遵循物理；穿模是 Box Collider 被误关，打开即正常碰撞。
- [24:26] Unity 开发主要工序 = 给每个 GameObject 设计不同 Component，自定义功能以脚本形式存在。
- [25:49] 脚本：Add Component→New Script 建 PlayerMove；模板继承 MonoBehaviour（Unity 脚本基类）；Start 首帧前调用一次（初始化），Update 每帧调用（相当于主循环）。
- [29:34] hello world：Debug.Log 输出到 Console；放 Start 打一次、放 Update 每帧打。
- [31:31] 关键心智模型：界面是代码的"数字孪生"——每个 GameObject 对应 GameObject 类实例、每个 Component 对应一个类，一一映射。
- [33:27] public 字段显示在 Inspector、可拖拽引用/实时调试，private 不可；GetComponent`<T>`() 拿组件；position 是 Vector3（XYZ 三元组）。
- [39:52] this.gameObject 取脚本挂载的对象；在 ground 上也挂同脚本则两个同时执行——讲师借此说 Unity 是"多线程"驱动（编者注：实为引擎消息循环回调，措辞不严谨）。
- [43:19] Rigidbody.AddForce 施力（演示 (0,15,0) 小球飞天）；Vector3.up 等预设方向等价 (0,1,0)。
- [45:43] Input.GetKey 读键位：按住持续 true；配 if 处理 WASD 实现移动；小球易翻滚→新建 Physics Material 把 friction 与弹性调 0。⏭️可跳过：调参演示，知道结论即可。
- [50:31] 相机跟随：新建 FollowPlayer 挂到 Main Camera；public Vector3 offset 定义固定偏差（public 为在 Inspector 实时调）；Start 里 GameObject.Find("Player") + GetComponent 拿双方 Transform；Update 里 position = player.position + offset。
- [54:25] Unity 是动态环境：运行时可能生成成百上千物体，Find/GetComponent 把"找对象"复杂性抽离。
- [57:32] offset 调至 (0,3,-20) 左右即俯视跟随视角。⏭️可跳过：调参试错较长。
- [1:00:48] 碰撞检测（值得精看）：不用自己轮询，OnCollisionEnter 是碰撞发生时被系统回调的 event function；参数 Collision 带碰撞点/冲量/对方 collider；同类还有 OnEnable/OnDestroy 等。
- [1:04:24] 失败处理两法：AddForce(velocity, ForceMode.VelocityChange) 强制速度归零；或 GetComponent`<PlayerMove>`().enabled=false 禁用操控组件。
- [1:09:02] 撞地也失败→给 obstacle 加 Tag，用 CompareTag 判断只撞障碍物才判负（比字符串比较快）。
- [1:14:23] Prefab 预制体：GameObject 拖进 Assets 即成模板；改 prefab 属性所有实例同步（类比 Word 母版），批量摆障碍搭关卡。
- [1:18:14] 搭关卡技巧：Scene 点 Y 轴切俯视、透视/正交切换按钮（或 2D 按钮）正交视角摆位更准；Ctrl+D 复制；按 Ctrl 贴网格移动。
- [1:20:18] 氛围：Camera 清除方式改 Solid Color 有街机感；Window→Rendering→Lighting→Environment 加 Fog（0.03 左右）让远方渐显。
- [1:22:13] 收束：界面→建物体→材质→脚本→prefab→环境氛围的完整工作流；后续课程讲高阶用法与渲染。

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
