/**
 * Specifies the privacy level of the tool.
 */
export enum ToolPrivacyLevel {
	anonymous = "anonymous",
	public = "public",
	name_only = "name_only",
	email_only = "email_only"
}

/**
 * Specifies the type of tool message.
 */
export enum ToolMessageType {
	"LtiResourceLinkRequest",
	"LtiDeepLinkingRequest"
}

/**
 * Determines what users can see a link to launch this message. 
 * The "admins" value indicates users that can manage the link can see it, 
 * which for the Global Navigation placement means administrators, but in courses means administrators and instructors. 
 * The "members" value indicates that any member of the context the link appears in can see the link, and "public" means visible to all.
 */
export enum ToolMessageVisibility {
	"admins",
	"members",
	"public"
}

/**
 * Specifies how to launch the tool. See the Navigation Tools Settings docs for details on each option.
 * Note: "new_window" is only valid for Dynamic Registration, and produces the same behavior as
 * setting windowTarget: _blank in a Canvas LTI 1.3 JSON configuration.
 */
export enum ToolDisplayType {
	"default",
	"full_width",
	"full_width_in_context",
	"in_nav_context",
	"borderless",
	"new_window"
}