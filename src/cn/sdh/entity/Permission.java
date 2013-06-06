package cn.sdh.entity;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.struts2.json.annotations.JSON;

import cn.sdh.common.base.AuditEntity;

/**
 * 权限类(菜单,按钮,功能)
 * @author 孙东辉
 */
@Entity
@Table(name="permissions")
public class Permission extends  AuditEntity{

	/**
	 * 
	 */
	private static final long serialVersionUID = 7930766554705439940L;


	@Id
	@Column(name="id")
	private Long id;
	
	
	@Column(name="name")
	private String name;
	
	/**
	 * 访问地址
	 */
	@Column(name="actionurl")
	private String actionUrl;
	
	/**
	 * js文件地址
	 */
	@Column(name="jsurl")
	private String jsUrl;
	
	/**
	 * 等级 1-N
	 */
	@Column(name="level")
	private int level;
	
	/**
	 * 父级编号
	 */
	@Column(name="parentid")
	private Long parentid;
	
	/**
	 * 弹出的控件类
	 */
	@Transient
	private String controlType;
	
	@Transient
	private int leaf;
	
	@Transient
	private boolean checked;
	
	@Transient
	private boolean expanded = true;
	
	@OneToMany(fetch=FetchType.EAGER)
	@JoinColumn(name = "parentid", referencedColumnName="id",insertable=false,updatable=false)
	private List<Permission> children;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getActionUrl() {
		return actionUrl;
	}

	public void setActionUrl(String actionUrl) {
		this.actionUrl = actionUrl;
	}

	public String getJsUrl() {
		return jsUrl;
	}

	public void setJsUrl(String jsUrl) {
		this.jsUrl = jsUrl;
	}

	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}

	public Long getParentid() {
		return parentid;
	}

	public void setParentid(Long parentid) {
		this.parentid = parentid;
	}

	@JSON(name="text")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getControlType() {
		if(this.jsUrl!=null)
			return getControlTypeByDg(this.jsUrl);
		else
			return this.controlType;
	}

	public void setControlType(String controlType) {
		this.controlType = controlType;
	}
	
	public int getLeaf() {
		if(this.level==3){
			return 1;
		}
		return this.leaf;
	}

	public void setLeaf(int leaf) {
		this.leaf = leaf;
	}

	public boolean isChecked() {
		return checked;
	}

	public void setChecked(boolean checked) {
		this.checked = checked;
	}
	
	public List<Permission> getChildren() {
		return children;
	}

	public void setChildren(List<Permission> children) {
		this.children = children;
	}
	
	public boolean isExpanded() {
		return expanded;
	}

	public void setExpanded(boolean expanded) {
		this.expanded = expanded;
	}

	/**
	 * 通过路径获得组件名称
	 * @param path
	 * @return
	 */
	public String getControlTypeByDg(String path){
		if(path.indexOf("/")>=0){
			path = path.replaceFirst(path.substring(path.indexOf("/"),path.indexOf("/")+2), path.substring(path.indexOf("/")+1,path.indexOf("/")+2).toUpperCase());
			
			return getControlTypeByDg(path);
		}else{
			return path;
		}
		
	}

}
