import { parserHTML } from "./parser";
import { generate } from "./generate";

export function compileToFunction(template) {

    
  let root =  parserHTML(template)
  
  let code = generate(root)

  let render = new Function(`with(this){return ${code}}`)  //code中会用到数据  数据在vm上

  return render;
    // html => ast(只能描述语法 语法不存在的属性无法描述) =>  render函数(with + new Function) => 虚拟dom（增加额外的属性 ）
}


// let obj = {a:1}
// with(obj){
//     console.log(a);  // 1  
// }

