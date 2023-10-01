use crate::{instance_bundle::InstanceBundle, message::ParsedPrivmsgMessage};
use async_trait::async_trait;

#[async_trait]
pub trait Command {
    fn get_name(&self) -> String;
    async fn execute(
        &self,
        instance_bundle: &InstanceBundle,
        message: ParsedPrivmsgMessage,
    ) -> Option<Vec<String>>;
}

pub struct CommandLoader {
    pub commands: Vec<Box<dyn Command + Send + Sync>>,
}

impl CommandLoader {
    pub fn new() -> Self {
        Self { commands: vec![] }
    }

    pub async fn execute_command(
        &self,
        instance_bundle: &InstanceBundle,
        message: ParsedPrivmsgMessage,
    ) -> Result<Option<Vec<String>>, &str> {
        if let Some(command) = self
            .commands
            .iter()
            .find(|x| x.get_name().eq(message.command_id.as_str()))
        {
            return Ok(command.execute(instance_bundle, message).await);
        }
        Err("bruh")
    }
}
