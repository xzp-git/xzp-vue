import { parserHTML } from "./parser";
import { generate } from "./generate";

export function compileToFunction(template) {
  //将模板解析成 抽象语法树
  let root = parserHTML(template);
  //将抽象语法树 转化成 code
  let code = generate(root);
  //生成render函数 render函数的作用是用来 生成 虚拟dom的
  let render = new Function(`with(this){return ${code}}`); //code中会用到数据  数据在vm上

  return render;
  // html => ast(只能描述语法 语法不存在的属性无法描述) =>  render函数(with + new Function) => 虚拟dom（增加额外的属性 ）
}

// let obj = {a:1}
// with(obj){
//     console.log(a);  // 1
// }
