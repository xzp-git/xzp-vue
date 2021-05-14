import babel from 'rollup-plugin-babel'
export default{
  input: './src/index.js',
  output: {
    format: 'umd', //支持amd和commonJs规范 
    name: 'Vue',// window.Vue 
    file: 'dist/vue.js',
    sourcemap: true 
  },
  plugins: [
    babel({
      exclude:'node_modules/**'
    })
  ]
}