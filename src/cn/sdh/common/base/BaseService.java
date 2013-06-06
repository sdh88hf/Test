package cn.sdh.common.base;

import org.apache.log4j.Logger;

import cn.sdh.common.exception.ServiceException;

public abstract class BaseService {
	
	protected abstract Logger getLogger();
	 
	 public void throwException(String msg,String strck) throws ServiceException{
		 getLogger().error("serviceException---"+strck);
		 
		 throw new ServiceException(msg, strck);
	 }
	

}
