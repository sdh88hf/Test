package cn.sdh.dwr;

import org.springframework.stereotype.Component;

@Component(value="UserDwrCall")
public class UserDwrCall {
	
	public String test(){
		JavaCallJsByDwr.info("aa");
		
		return "aaa";
	}
	
	public String test2(){
		
		return "ccc";
	}
	
	
}
