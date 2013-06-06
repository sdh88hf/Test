package cn.sdh.common.exception;

public class ApplicationException extends Exception {
	
	private static final long serialVersionUID = 7279959457380615125L;

	private String msg;
	
	private String strck;

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
