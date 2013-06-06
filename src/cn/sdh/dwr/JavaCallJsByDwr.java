package cn.sdh.dwr;

import org.directwebremoting.Browser;
import org.directwebremoting.ScriptSessions;

public class JavaCallJsByDwr {
	static int num = 0;
	public static void info(final String message) {
		try{
		
		Browser.withAllSessions(new Runnable() {
			@Override
			public void run() {
				System.out.println("aaa");
				ScriptSessions.addFunctionCall("aa",new Object[] { num++ });
			}
		});
		
//		Browser.withAllSessionsFiltered(new AllSessionFilter() ,new Runnable() {
//					@Override
//					public void run() {
//						System.out.println("aaa");
//						ScriptSessions.addFunctionCall("aa",new Object[] { message });
//					}
//				});
		
//		Browser.withCurrentPageFiltered(new AllSessionFilter(),
//				new Runnable() {
//					@Override
//					public void run() {
//						System.out.println("aaa");
//						ScriptSessions.addFunctionCall("aa",new Object[] { message });
//					}
//				});
		}catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
		}
	}
}
