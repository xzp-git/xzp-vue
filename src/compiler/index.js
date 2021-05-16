const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名 
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //  用来获取的标签名的 match后的索引为1的
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配开始标签的 
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配闭合标签的
//           aa  =   "  xxx "  | '  xxxx '  | xxx
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // a=b  a="b"  a='b'
const startTagClose = /^\s*(\/?)>/; //   >  />   <div/>
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{aaaaa}}
// 将解析的结果组装成一个树结构  栈
function start(tagName, attributes) {
        console.log(tagName, attributes);
}

function end(tagName) {
    console.log(tagName);
}

function chars(text) {
    console.log(text);
}
// html字符串解析成  对应的脚本来触发 tokens,  <div id="app">{{name}}</div>

function parserHTML(html) { //</div>    
    function advance(len) {
        html = html.substring(len)
    }
    function parseStartTag () {
        const start = html.match(startTagOpen)

        if ( start ) {
            const match = {
                tagName: start[1],
                attrs:[]
            }
            advance(start[0].length)

            let end
            // 如果没遇到标签结尾就不停的解析
            let attr
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({name: attr[1], value:attr[3] || attr[4] || attr[5]})
                advance(attr[0].length)
            }
            if (end) {
                advance(end[0].length);
            }
            return match
        }
        return false
    }

    while (html) {  //看解析的内容是否存在，如果存在就不停的解析
        let textEnd = html.indexOf('<')
        if (textEnd === 0) {
            const startTagMatch = parseStartTag()
            
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }

            const endTagMatch = html.match(endTag)
            if (endTagMatch) {
               end(endTagMatch[1]) 
               advance(endTagMatch[0].length)
               continue
            }
        }

        let text
        if (textEnd > 0) {
            text = html.substring(0,textEnd) 
        }
        if (text) {
            chars(text)
            advance(text.length)
        }

        
    }

    return false
}


export function compileToFunction(template) {

    
    parserHTML(template)
}