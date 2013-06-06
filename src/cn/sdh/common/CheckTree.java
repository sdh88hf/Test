package cn.sdh.common;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("serial")
public class CheckTree implements Serializable {
	
	private String text;
	
	private boolean expanded = true;
	
	private boolean leaf = true;
	
	private boolean checked = false;
	
	private String id;
	
	private List<CheckTree> children = new ArrayList<CheckTree>();

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public boolean isExpanded() {
		return expanded;
	}

	public void setExpanded(boolean expanded) {
		this.expanded = expanded;
	}

	public boolean isLeaf() {
		return leaf;
	}

	public void setLeaf(boolean leaf) {
		this.leaf = leaf;
	}

	public boolean isChecked() {
		return checked;
	}

	public void setChecked(boolean checked) {
		this.checked = checked;
	}

	public List<CheckTree> getChildren() {
		return children;
	}

	public void setChildren(List<CheckTree> children) {
		this.children = children;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

}
