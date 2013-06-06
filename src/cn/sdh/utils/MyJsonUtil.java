package cn.sdh.utils;

import java.util.ArrayList;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class MyJsonUtil {
	
	@SuppressWarnings("rawtypes")
	public static List getObjectsByJson(String json,Class clazz){
		
		List<Object> list = new ArrayList<Object>();
		JSONArray ja = JSONArray.fromObject(json);
		
		JSONObject jo = null;
		Object ob = null;
		for(int i = 0;i<ja.size();i++){
			jo = ja.getJSONObject(i);
			ob = JSONObject.toBean(jo,clazz);
			list.add(ob);
		}
		
		return list;
	}
	
	

}
