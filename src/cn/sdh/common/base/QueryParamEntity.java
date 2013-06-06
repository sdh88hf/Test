package cn.sdh.common.base;



public class QueryParamEntity{
	private String optionSign = "=";//符号
	
	private String beforeSign = "";//前缀
	
	private String afterSign = "";//后缀
	
	public QueryParamEntity(){
		
	}
	
	public QueryParamEntity(String optionSign){
		this.optionSign = optionSign;
	}
	
	public QueryParamEntity(String optionSign,String beforeSign){
		this.optionSign = optionSign;
		this.beforeSign = beforeSign;
	}
	
	public QueryParamEntity(String optionSign,String beforeSign,String afterSign){
		this.optionSign = optionSign;
		this.beforeSign = beforeSign;
		this.afterSign = afterSign;
	}

	public String getOptionSign() {
		return optionSign;
	}

	public void setOptionSign(String optionSign) {
		this.optionSign = optionSign;
	}

	public String getBeforeSign() {
		return beforeSign;
	}

	public void setBeforeSign(String beforeSign) {
		this.beforeSign = beforeSign;
	}

	public String getAfterSign() {
		return afterSign;
	}

	public void setAfterSign(String afterSign) {
		this.afterSign = afterSign;
	}
}
