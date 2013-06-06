package cn.sdh.common.base;

import java.util.Date;


public abstract class AuditEntity extends BaseEntity {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 4065098774240916734L;
	
	
	private Date updateDate;

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

}
