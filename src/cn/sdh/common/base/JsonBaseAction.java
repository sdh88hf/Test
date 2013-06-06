package cn.sdh.common.base;

import java.util.List;

import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;

import cn.sdh.common.Page;
import cn.sdh.common.exception.ServiceException;

import com.opensymphony.xwork2.ActionSupport;

/**
 * 针对Extjs开发的action父类
 * 
 * @author 孙东辉
 * 
 * @param <T>
 */
@Results({
// 返回Action堆栈内所有对象 ignoreHierarchy=false(取消父子分离,将父类的属性也作为json传递)
// excludeNullProperties 排除为null的对象
// excludeProperties 排除指定属性
@Result(name = "jsonall", type = "json", params = { "excludeNullProperties",
		"true" }) })
@SuppressWarnings("serial")
public abstract class JsonBaseAction<T extends BaseEntity> extends
		ActionSupport {

	// 返回所有josn的字符串
	public static final String JSON = "jsonall";

	// json返回执行结果
	private boolean success = true;

	// json返回执行信息
	private String msg;

	private Integer start;

	private Integer limit;
	
	private Long totalProperty;

	protected void putResult(boolean success, String msg) {
		this.setSuccess(success);
		this.setMsg(msg);
	}
	
	public JsonBaseAction(){
		setEntity();
	}

	// 查询的集合
	protected List<T> searchList = null;

	// 明细实体 也是作为参数的载体
	protected T entity;

	public String query() {
		Page p = new Page();
		if(limit!=null)
		p.setPageSize(limit);
		if(start!=null)
		p.setCurrentPage(start);
		try {
			searchList(p);
			totalProperty = p.getCount();
		} catch (ServiceException e) {
			this.setSuccess(false);
			this.setMsg(e.getMessage());
		}

		if (this.success) {
			this.setMsg("查询成功");
		}

		return JSON;
	}

	public String find() {
		try {
			searchEntity();
		} catch (ServiceException e) {
			this.setSuccess(false);
			this.setMsg(e.getMessage());
		}

		if (this.success) {
			this.setMsg("查询成功");
		}

		return JSON;
	}
	
	public String save(){
		try {
			addOrUpdEntity();
		} catch (ServiceException e) {
			this.setSuccess(false);
			this.setMsg(e.getMessage());
		}

		if (this.success) {
			this.setMsg("保存成功");
		}
		
		return JSON;
	}
	
	public String delete(){
		try {
			deleteEntity();
		} catch (ServiceException e) {
			this.setSuccess(false);
			this.setMsg(e.getMessage());
		}

		if (this.success) {
			this.setMsg("删除成功");
		}
		
		return JSON;
	}
	
	// 需要子类实现的查询列表方法
	public abstract void searchList(Page page) throws ServiceException;

	// 查询明细
	public abstract void searchEntity() throws ServiceException;

	// 删除
	public abstract void deleteEntity() throws ServiceException;

	// 新增或修改
	public abstract void addOrUpdEntity() throws ServiceException;
	
	public abstract void setEntity();

	// public abstract T getModul() throws ActionException;

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public T getEntity() {
		return entity;
	}

	public void setEntity(T entity) {
		this.entity = entity;
	}

	public Long getTotalProperty() {
		return totalProperty;
	}

	public void setTotalProperty(Long totalProperty) {
		this.totalProperty = totalProperty;
	}

	public List<T> getSearchList() {
		return searchList;
	}

	public void setSearchList(List<T> searchList) {
		this.searchList = searchList;
	}

	public Integer getStart() {
		return start;
	}

	public void setStart(Integer start) {
		this.start = start;
	}

	public Integer getLimit() {
		return limit;
	}

	public void setLimit(Integer limit) {
		this.limit = limit;
	}

}
