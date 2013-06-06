package cn.sdh.common.exception;


public class ServiceException extends ApplicationException {
	
	private static final long serialVersionUID = 2108066862738471434L;

	private String msg;
	
	private String strck;
	
	public ServiceException(String msg,String strck){
		this.msg = msg;
		this.strck = strck;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public String getStrck() {
		return strck;
	}

	public void setStrck(String strck) {
		this.strck = strck;
	}

}
