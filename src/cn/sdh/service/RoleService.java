package cn.sdh.service;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.sdh.common.Constants;
import cn.sdh.common.base.BaseService;
import cn.sdh.common.exception.ServiceException;
import cn.sdh.dao.RoleDao;
import cn.sdh.entity.Permission;
import cn.sdh.entity.Role;

@Service
@Transactional
public class RoleService extends BaseService {
	@Autowired
	private RoleDao roleDao;

	public List<Role> query(Role entity) throws ServiceException {

		List<Role> list = null;

		try {
			list = roleDao.queryRoles(entity);
		} catch (Exception e) {
			throwException(Constants.DAOEXCEPTIONTIP, e.getMessage());
		}

		return list;

	}

	public List<Role> query() throws ServiceException {

		List<Role> list = null;

		try {
			list = roleDao.queryRoles(new Role());
		} catch (Exception e) {
			throwException(Constants.DAOEXCEPTIONTIP, e.getMessage());
		}

		return list;
	}

	public Role findById(Role entity) throws ServiceException {

		try {
			entity = roleDao.findRoleById(entity.getId());
		} catch (Exception e) {
			throwException(Constants.DAOEXCEPTIONTIP, e.getMessage());
		}

		return entity;
	}

	/**
	 * 批量保存用户
	 * 
	 * @param list
	 * @throws ServiceException
	 */
	public void saves(List<Role> list) throws ServiceException {
		try {
			roleDao.saveList(list);
		} catch (Exception e) {
			throwException(Constants.DAOEXCEPTIONTIP, e.getMessage());
		}
	}

	/**
	 * 批量删除角色
	 * 
	 * @param ids
	 */
	public void deletes(String[] ids) throws ServiceException {
		try {
			if (ids != null && ids.length > 0) {
				for (int i = 0; i < ids.length; i++) {
					roleDao.deleteById(Long.parseLong(ids[i]));
				}
			}
		} catch (Exception e) {
			throwException(Constants.DAOEXCEPTIONTIP, e.getMessage());
		}
	}

	/**
	 * 保存角色拥有的权限
	 * 
	 * @param roleid
	 * @param perids
	 * @throws ServiceException 
	 */
	public void saveRolePermission(Long id, String perids) throws ServiceException {
		try {
			Role entity = roleDao.getEntityById(id);
			entity.getPermissionList().clear();
			String[] peridarr = perids.split(",");

			Permission per = null;
			for (int i = 0; i < peridarr.length; i++) {
				per = new Permission();
				per.setId(Long.parseLong(peridarr[i]));

				entity.getPermissionList().add(per);
			}
			roleDao.save(entity);
		} catch (Exception e) {
			throwException(Constants.DAOEXCEPTIONTIP, e.getMessage());
		}
	}

	@Override
	protected Logger getLogger() {
		return Logger.getLogger(RoleService.class);
	}
}
