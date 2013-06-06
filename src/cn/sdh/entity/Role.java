package cn.sdh.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OrderBy;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import cn.sdh.common.base.AuditEntity;

/**
 * 角色类
 * @author 孙东辉
 */
@Entity
@Table(name="roles")
public class Role extends  AuditEntity{

	/**
	 * 
	 */
	private static final long serialVersionUID = 5459879676154477558L;

	@Id
	@Column(name="id")
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_ROLE")
	@SequenceGenerator(name = "SEQ_ROLE", sequenceName = "SEQ_ROLE", initialValue = 100, allocationSize = 1)
	private Long id;
	
	/**
	 * 角色名称
	 */
	@Column(name="rolename")
	private String roleName;
	
	/**
	 * 拥有的权限集合
	 */
	@ManyToMany(fetch = FetchType.EAGER)
	@Fetch(FetchMode.SUBSELECT)
	@OrderBy("level")
	@JoinTable(name="role_permission",joinColumns={@JoinColumn(name="roleid")},inverseJoinColumns={@JoinColumn(name="perid")})
	private List<Permission> permissionList = new ArrayList<Permission>();
	

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public List<Permission> getPermissionList() {
		return permissionList;
	}

	public void setPermissionList(List<Permission> permissionList) {
		this.permissionList = permissionList;
	}

}
