import React from 'react'
import ReactDOM from 'react-dom'
import '../css/style.css'

if(__DEV__) {
	console.log("现在是开发环境");
}
else {
	console.log("现在是生产环境");
}

console.log("process.env.NODE_ENV为"+process.env.NODE_ENV);

ReactDOM.render((
	<div>
		<div>hello </div>
		<img width="50" style={{marginTop:'50px'}} src={require("../images/pig2.jpg")}/>
	</div>

	),document.getElementById('app'));
