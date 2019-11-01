# Quick Guide
## 连接流程
1. 调用connect                      `mongoose.connect()`
2. open 事件调用后，说明数据库连接成功  `db.once('open', () => {})`

## 新建 Model 流程
1. 新建 Schema              `const kittySchema = new mongoose.Schema({ name: String })`
2. 编译 Schema              `const Kitty = mongoose.model('Kitty', kittySchema)`

## 保存数据
1. 新建一个 Model 对象       `const silence = new Kitty({ name: '刘洋' })`
2. 保存，然后传一个回调，或者用await `const res = await silence.save()`

## 查询数据
1. 利用 Model               `const res = await Kitty.find({ name: /^kitty/ })`