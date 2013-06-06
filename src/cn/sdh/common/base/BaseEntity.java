package cn.sdh.common.base;

import java.io.Serializable;

@SuppressWarnings("serial")
public abstract class BaseEntity implements Serializable{
	
	protected abstract Long getId();

}
