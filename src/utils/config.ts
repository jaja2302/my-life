export interface AppConfig {
  password: string;
  settings: {
    maxAttempts: number;
    lockoutTime: number;
  };
}

export const defaultConfig: AppConfig = {
  password: '23',
  settings: {
    maxAttempts: 3,
    lockoutTime: 30000
  }
};

export const loadConfig = async (): Promise<AppConfig> => {
  try {
    const response = await fetch('/data/config.json');
    if (response.ok) {
      const config = await response.json();
      return {
        password: config.password || defaultConfig.password,
        settings: {
          maxAttempts: config.settings?.maxAttempts || defaultConfig.settings.maxAttempts,
          lockoutTime: config.settings?.lockoutTime || defaultConfig.settings.lockoutTime
        }
      };
    }
  } catch (error) {
    console.log('Failed to load config, using default configuration');
  }
  
  return defaultConfig;
};

export const updatePassword = async (newPassword: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: newPassword }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to update password:', error);
    return false;
  }
};
