package cn.sdh.action;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.apache.struts2.json.JSONException;
import org.apache.struts2.json.JSONUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import cn.sdh.common.Page;
import cn.sdh.common.base.JsonBaseAction;
import cn.sdh.common.exception.ServiceException;
import cn.sdh.dwr.JavaCallJsByDwr;
import cn.sdh.dwr.UserDwrCall;
import cn.sdh.entity.Account;
import cn.sdh.entity.Permission;
import cn.sdh.service.AccountService;
import cn.sdh.utils.MyJsonUtil;
import cn.sdh.utils.SpringSecurityUtils;

@Namespace("/")
@SuppressWarnings("serial")
@Results({@Result(name = "index",location="index.jsp")})
@Controller(value="AccountAction")
public class AccountAction extends JsonBaseAction<Account> {
	@Autowired
	UserDwrCall userdwrCall;
	@Autowired
	private AccountService accountService;
	
	private List<Account> accountList = new ArrayList<Account>();
	
	@Override
	public void searchList(Page page) {
		try {
			searchList = accountService.query(page,entity);
		} catch (ServiceException e) {
			this.putResult(false, e.getMsg());
		}
		
	}

	@Override
	public void searchEntity() {
		try {
			entity = accountService.findByName(entity.getUsername());
		} catch (ServiceException e) {
			this.putResult(false, e.getMsg());
		}
	}

	@Override
	public void deleteEntity() {
		try {
			String [] idsarr = getMsg().split(",");
			accountService.deletes(idsarr);
		} catch (ServiceException e) {
			this.putResult(false, e.getMsg());
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public void addOrUpdEntity() {
		List<Account> accountList = MyJsonUtil.getObjectsByJson(getMsg(), Account.class);
		
		try {
			accountService.saves(accountList);
		} catch (ServiceException e) {
			this.putResult(false, e.getMsg());
		}
	}
	
	
	/**
	 * 跳转到主页
	 * @throws JSONException 
	 */
	public String index() throws JSONException{
		
		entity = SpringSecurityUtils.getCurrentUser();
		
		List<Permission> perList = entity.getSignPer();
		
		HttpServletRequest request = ServletActionContext.getRequest();
		request.setAttribute("perList", entity.getSignPer());
		request.setAttribute("perListJson", JSONUtil.serialize(perList));
		
		return "index";
	}
	
	public void aa(){
		//userdwrCall.test();
		JavaCallJsByDwr.info("aa");
	}

	@Override
	public void setEntity() {
		searchList = new ArrayList<Account>();
		entity = new Account();
	}

	public List<Account> getAccountList() {
		return accountList;
	}

	public void setAccountList(List<Account> accountList) {
		this.accountList = accountList;
	}

}
