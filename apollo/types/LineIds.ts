// Copyright (C) 2022 NotDankEnough (ilotterytea)
// 
// This file is part of itb2.
// 
// itb2 is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// itb2 is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with itb2.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Localization line IDs.
 */
type LineIds = 
// Other:
"msg.arrive" |
"msg.leave" |
"msg.joined" |
"msg.test" |
"msg.error" |
"msg.banned" |
"msg.usage" |
"msg.api_error" |
"msg.wrong_option" |
"measure.megabytes" |
// Emote updater:
"emoteupdater.new_emotes" |
"emoteupdater.deleted_emotes" |
"emoteupdater.user_added_emote" |
"emoteupdater.user_deleted_emote" |
"emoteupdater.user_updated_emote" |
// Modes:
"mode.descending" |
"mode.ascending" |
// Timer:
"timer.new" |
"timer.exists" |
"timer.not_exists" |
"timer.removed" |
"timer.disabled" |
"timer.enabled" |
"timer.incorrect_interval" |
"timer.info" |
"timer.list" |
// Static commands:
"staticcmd.new" | 
"staticcmd.already_exists" | 
"staticcmd.remove" | 
"staticcmd.not_exists" | 
"staticcmd.enable" | 
"staticcmd.disable" | 
"staticcmd.not_a_line_id" |
"staticcmd.push" | 
"staticcmd.push.limit_reached" | 
"staticcmd.editline" | 
"staticcmd.line_not_exists" | 
"staticcmd.rmline" | 
"staticcmd.copy" | 
"staticcmd.copy.command_not_specified" |
"staticcmd.copy.command_not_exists" | 
"staticcmd.copy.target_not_exists" | 
"staticcmd.list" | 
"staticcmd.list.no_cmds" |
"staticcmd.info" |
"staticcmd.specify_command" |
// Github webhook notifications:
"gh.push" |
"gh.issue.opened" | 
"gh.issue.edited" | 
"gh.issue.deleted" | 
"gh.issue.pinned" | 
"gh.issue.unpinned" | 
"gh.issue.closed" | 
"gh.issue.reopened" | 
"gh.issue.assigned" | 
"gh.issue.unassigned" | 
"gh.issue.labeled" | 
"gh.issue.unlabeled" | 
"gh.issue.locked" | 
"gh.issue.unlocked" | 
"gh.issue.transferred" | 
"gh.issue_comment.created" | 
"gh.issue_comment.edited" | 
"gh.issue_comment.deleted" | 
"gh.branch.created" | 
"gh.branch.deleted" | 
"gh.pcard.created" | 
"gh.pcard.edited" |  
"gh.pcard.moved" |  
"gh.pcard.converted" |  
"gh.pcard.deleted" |  
"gh.pcard.created" |  
"gh.pcard.edited" |  
"gh.pcard.moved" |  
"gh.pcard.converted" |  
"gh.pcard.deleted" |  
"gh.project.created" |  
"gh.project.edited" |  
"gh.project.closed" |  
"gh.project.reopened" |  
"gh.project.deleted" |  
"gh.release.published" |  
"gh.dependabot.alert" |
"gh.pr.opened" |
"gh.pr.closed" |
"gh.pr.reopened" |
"gh.pr.ready_for_review" |
"gh.pr.assigned" |
"gh.pr.unassigned" |
"gh.pr.labeled" |
"gh.pr.unlabeled" |
"gh.pr.locked" |
"gh.pr.unlocked" |
"gh.pr_review.submitted" |
"gh.pr_review.edited" |
"gh.pr_review.dismissed" |
// Ping command:
"cmd.ping.response" |
// Ecount command:
"cmd.ecount.response" |
"cmd.ecount.not_found" |
// Etop command:
"cmd.etop.response" |
"cmd.etop.limit_reached" |
// Join command:
"cmd.join.response" |
"cmd.join.already_in" |
// Spam command:
"cmd.spam.limit_reached" |
"cmd.spam.unresolved_number" |
"cmd.spam.forbidden_symbol" |
// System command:
"cmd.system.restart" |
"cmd.system.poweroff" |
"cmd.system.pull" |
"cmd.system.pulled" |
"cmd.system.not_found" |
// User command:
"cmd.user.lookup" |
"cmd.user.lookup.bio" |
"cmd.user.lookup.color" |
"cmd.user.lookup.partner" |
"cmd.user.lookup.affiliate" |
"cmd.user.lookup.bot" |
"cmd.user.lookup.banned" |
"cmd.user.lookup.7tv.joined" |
"cmd.user.lookup.7tv.emotes" |
"cmd.user.lookup.7tv.editors" |
"cmd.user.lookup.7tv.role" |
"cmd.user.rules" |
"cmd.user.picture" |
// Settings command:
"cmd.set.language.success" |
"cmd.set.language.available" |
"cmd.set.language.not_found" |
"cmd.set.prefix.success" |
"cmd.set.event.seventv.disabled" |
"cmd.set.event.seventv.enabled";

export default LineIds;