package cn.sdh.dwr;

import org.directwebremoting.ScriptSession;
import org.directwebremoting.ScriptSessionFilter;


public class AllSessionFilter implements ScriptSessionFilter{
	

	@Override
	public boolean match(ScriptSession session) {
		String httpSessionId = (String) session.getAttribute("org.directwebremoting.ScriptSession.HttpSessionId");
		
		if(httpSessionId!=null){
			return true;
		}
		
		return false;
	}

	

}
