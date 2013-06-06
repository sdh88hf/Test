package cn.sdh.common.listener;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.*;


public class ActiveUserListener implements HttpSessionListener {
	private static int sessionCount = 0;
	private static Map<String,HttpSession> sessionMaps = new HashMap<String,HttpSession>(); // 存放session的集合类
	private static Map<String, String> userSessionMaps = new HashMap<String, String>();
	public void sessionCreated(HttpSessionEvent arg0) {
		HttpSession session = arg0.getSession();
		String sessionId = session.getId();
		System.out.println("Create a session:" + sessionId);
		sessionMaps.put(sessionId, session);
		sessionCount++;
	}
	

	public void sessionDestroyed(HttpSessionEvent arg0) {
		
		String sessionId = arg0.getSession().getId();
		
		String userName = null;
		//查找对应的用户名
		for(String k : userSessionMaps.keySet()){
			if(sessionId.equals(userSessionMaps.get(k))){
				userName = k;
			}
		}
		
		deleteActiveUser(userName, sessionId);
		
		sessionCount--;
		System.out.println("Destroy a session:" + sessionId);
	}
	
	/**
	 * 存放用户与session的对应关系
	 * @param username
	 * @param sessionId
	 */
	public static void putUserSession(String userName,String sessionId){
		userSessionMaps.put(userName, sessionId);
	}
	
	/**
	 * 用户退出的时候
	 * @param userName
	 */
	public static void deleteActiveUser(String userName,String sessionId){
		sessionMaps.remove(sessionId);
		
		if(userName!=null){
			userSessionMaps.remove(userName);
		}
	}

	public static int getSessionCount() {
		return sessionCount;
	}

	public static Map getSessionMaps() {
		return sessionMaps;
	}
}