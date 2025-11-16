export const allowedPages = [
  'energy',
  'config/dashboard',
  'todo',
  'developer-tools/yaml',
  'logbook',
  'history',
  'config/integrations/dashboard',
  'config/voice-assistants/assistants',
  'config/automation/dashboard',
  'config/cloud/account',
  'hassio/dashboard',
  'config/areas/dashboard',
  'config/lovelace/dashboards',
  'config/tags',
  'config/person',
  'config/system'
];

export const showMenuBtn: { [key: string]: boolean } = {
  'energy': true,
  'config/dashboard': true,
  'todo': true,
  'developer-tools/yaml': true,

  'logbook': false,
  'history': false,
  'config/integrations/dashboard': false,
  'config/voice-assistants/assistants': false,
  'config/automation/dashboard': false,
  'config/cloud/account': false,
  'hassio/dashboard': false,
  'config/areas/dashboard': false,
  'config/lovelace/dashboards': false,
  'config/tags': false,
  'config/person': false,
  'config/system': false,
}