## 计算机体系结构/内存分层
* 计算机体系结构
  * CPU
  * 内存
    * CPU寄存器
    * Cache
    * 主存
    * 磁盘（虚拟内存）
  * IO设备
* 内存分层体系
* 范例
### 操作系统目标
1. 抽象（逻辑地址空间）
2. 保护（独立地址空间）
3. 共享（访问相同内容）
4. 虚拟化（更多地址空间）
``` mermaid
pie
title 内存
    "Kernel": 3
    "Program A": 2
    "Program B": 2
    "Program C": 2
    "Free": 5
```
``` mermaid
pie
title 虚拟内存
    "Free": 10
    "Program C": 3
```
## 地址空间 & 地址生成
* 地址空间定义
  * 物理地址空间（硬件支持的地址空间）
  * 逻辑地址空间（一个运行的程序所拥有的地址范围）
* 地址生成
  * 逻辑地址和物理地址由操作系统完成
  * 当ALU需要指令时，先到MMU中找逻辑地址对应的物理地址，没有就去主存中找
* 地址安全检查
  * 操作系统会为每个应用程序，生成每个程序对应可访问内存的起始地址和终止地址
  * 应用程序如果如果访问之外的内存，会产生异常
## 连续内存分配
* 内存碎片问题
  * 空闲内存不能被使用
  * 外部碎片
    * 分配单元之间的未使用内存
  * 内部碎片
    * 分配单元中的未使用内存
* 分区的动态分配
  * 第一适配
    * 为了分配N字节，使用第一个可用空闲块（大于N字节的）
    * 简单实现
      * 按地址排序的空闲块列表
      * 分配需要寻找一个合适的分区
      * 重分配需要检查，看是否自由分区能合并于相邻的空闲分区，若有
    * 优势
      * 简单
      * 易产生更大的空闲块，向着地址空间的结尾
    * 劣势
      * 容易产生外部碎片
      * 不确定性
  * 最佳适配
    * 为了适配N字节，使用空闲块差值最小的可用空闲块
    * 简单实现
      * 按尺寸排列的空闲列表
      * 分配需要寻找一个合适的分区
      * 重分配需要搜索及合并相邻的空闲分区，若有
    * 优势
      * 避免分割大空闲块
      * 最小化外部碎片产生的尺寸
      * 简单
    * 劣势
      * 外部碎片
      * 重分配慢
      * 容易产生
      * 易产生很多没用的微小碎片
  * 最差适配
    * 与最佳适配相反
    * 优势
      * 加入分配时中等尺寸，效果最好
      * 分配快
    * 劣势
      * 重分配慢
      * 外部碎片
      * 易于破碎大的空闲块以至于大分区无法被分配
* 压缩式碎片整理
  * 把内存中的程序挪一块去
* 交换式碎片整理
  * 运行时需要更多的内存
  * 抢占等待的程序 & 回收它们的内存
## 非连续内存分配
#### 为什么需要非连续内存
* 连续内存分配的缺点
  * 分配给一个程序的物理内存是连续的
  * 内存利用率低
  * 有外碎片、内碎片的问题
* 非连续内存分配的优点
  * 一个程序的物理地址空间是非连续的
  * 更好的内存利用和管理
  * 允许共享代码与数据（共享库）
  * 支持动态假造和动态链接
* 非连续分配缺点
  * 如何建立虚拟地址和物理地址之间的转换
    * 软件方案（开销过大）
    * 硬件方案
#### 管理方法
###### 分段
* 程序的分段地址空间
  * 程序运行时，堆、栈、代码区域等，放在内存中不同的物理地址中，以实现更好的隔离或者共享
  * 在逻辑上，一个程序的内存还是连续的，这之间的映射关系需要维护
* 分段寻址方案
  * CPU拿到地址，前面是段号，后面是段偏移地址
  * 段表存了端号，base，limit
  * 通过段表拿到了地址后，拿去比对，看是否满足限制
###### 分页
* 分页地址空间
  * 划分物理内存至固定大小的帧（Frame）$2^N$
  * 划分逻辑地址空间至相同大小的页（Page）$2^N$
  * 建立方案（Frame和Page之间的映射关系）
    * 页表
    * MMU/TLB
  * Frame
    * 一个内存物理地址是一个二元组$(f, o)$
    * $f$帧号（$F$位，一共有$2^F$个帧）
    * $o$帧内偏移（$S$位，每帧有$2^S$个字节）
    * 物理地址 = $2^S \times f + o $
  * Page
    * 与Frame类似
    * Frame和Page Size可能不同
    * Frame和Page offset相同，也就是大小相同
    * 一个内存逻辑是一个二元组$(p, o)$
    * $p$页号（$P$位，一共有$2^P$个帧）
    * $o$帧内偏移（$S$位，每页有$2^S$个字节）
    * 虚拟地址 = $2^S \times p + o $
    * $P \not ={F}$
    * $S_{Frame} = S_{Page}$
* 页寻址方案（减少了碎片）
  * 页映射到帧
  * 页是连续的虚拟内存
  * 帧是非连续的物理的内存
  * 不是所有的页都有对应的帧
###### 页表
* 页表概述
  * 页表结构
  * Index（Page Number）
  * 内容
    * Frame Number
    * 标志位
  * 性能问题
    * 页表非常大（64位机器，每页1024字节，需要$2^{54}$）
    * 每个应用程序都需要一个页表，CPU放不下
    * 访问一个内存单元需要二次内存访问
  * 解决
    * 缓存（时间）
    * 间接访问（空间）
* 转换后备缓冲区（TLB）（时间）
  * Translation Look-aside Buffer
  * 使用关联内存（associative memory）实现，具备快速访问性能
  * 如果TLB命中，物理页号可以很快被获取
  * 如果TLB未命中，对应的表项被更新到TLB中
  * X86硬件实现
  * MIPS等软件实现
* 二级/多级 页表（空间）
  * page number 分成 p1、p2
  * 一级页表存 p1和页表项的起始地址
  * 如果某一个映射关系不存在，可以不必保留对应的页表空间
  * 多级页表
    * 形成树状系统
* 反向页表（页表大小与逻辑地址大小没很大关系，与物理地址大小有关系）
  * 页寄存器
    * Index 变为 FrameNumber
    * 内容 变为 标志位 + PageNumber 
    * 优点
      * 转换表的大小相对于物理内存来说很小
      * 转换表的大小与逻辑地址空间的大小无关
    * 缺点
      * 需要的信息对调了，即根据帧号找到页号
      * 如何转换，根据页号找到帧号
      * 在需要的反向页表中搜索想要的页号
  * 基于关联内存的方案
    * 成本高
  * 基于hash的查找方案