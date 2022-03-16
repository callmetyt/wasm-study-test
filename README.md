<h1 style="text-align: center">Rust+WebAssembly的官方案例学习</h1>

- 按官方流程走了一遍，同时又用原生JS实现了一下

- 一些坑
  - wasm-pack第一次build时安装了wasm-bindgen，第二次build就卡在安装过程了（~~可能是网络问题...~~），需要加个`--mode no-install`，表示不再安装wasm-bindgen
  - Rust引入js_sys之后，webpack打包后始终出现`Renference Error`,后来修改成webpack的syncWebAssembly方式引入wasm正常运行

- TODO
  - 官方案例的额外练手内容补充
  - 原生JS补充
  - 按钮组逻辑抽离
  - ~~React实现一遍？~~