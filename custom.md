<p align="center">
  <img src="public/logo.svg" width="100" height="100" alt="Status Monitor Logo">
</p>

<h1 align="center">站点监测自定义文档</h1>

## 自定义文档说明

本文档包含对项目信息的说明，若你要自定义站点信息，建议阅读本文档。

## package.json 字段解释

- `name`：项目名称，不建议随意修改。
- `version`：版本号。
- `private`：防止误发布到 npm，建议保持为 true。
- `author`、`url`、`email`：作者信息，请根据实际情况修改。
- `repository`：仓库地址，请改为你的实际仓库地址。
- `repositoryUrl`：本项目仓库地址，请不要修改，保留信息是对原作者的尊重。
- `scripts`：项目常用命令，不建议随意删除或修改。
- `dependencies`、`devDependencies`：项目依赖，安装新包时自动更新。
 
 ## 更换站点图标

将你的图标分别转化为`favicon.ico`和`apple-touth-icon.png`，在`public`文件夹中替换原来的图标。

想更换为矢量图？  
将图标移入`public`，并在`index.html`的 link 标签中设置，例如
```html
<link rel="icon" type="image/svg+xml" href="/your-logo.svg" />
```

## 修改版权信息

- 年份：若想修改起始年份，请打开`src/components/Footer.vue`搜索字符`Copyright`，可以在同一行找到默认年份 2020，修改为实际年份即可。当前年份会动态加载，无需修改。
- 名字：年份后的名字及其超链接请在`package.json`中的`author`和`url`字段修改。

## 修改图标的超链接

同样的，支持在`package.json`中修改。