const mysql =require('mysql');

const config = {
	host: 'localhost',
	port:3306,
	user: 'root',
	password: '123456',
	database: "chenfu"
}

let connection = mysql.createConnection(config);
connection.connect((error)=>{
	if(error){
		console.log('连接数据库错误', error);
	}else{
		console.log('连接数据库成功');
	}
});

function query(sql, params = []){
	return new Promise((resolve, reject) =>{
		connection.query(sql, params, (error,data)=>{
			if(error){
				console.log("查询数据库错误",error);
				resolve({error: error.sqlMessage});
			}
			else{
				resolve(data);
			}
		})
	})
}

module.exports = {
	query
}