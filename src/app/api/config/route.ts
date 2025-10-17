import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'public', 'data', 'config.json');

export async function GET() {
  try {
    const configData = fs.readFileSync(CONFIG_FILE, 'utf8');
    const config = JSON.parse(configData);
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error reading config:', error);
    return NextResponse.json(
      { error: 'Failed to read configuration' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Read current config
    let config;
    try {
      const configData = fs.readFileSync(CONFIG_FILE, 'utf8');
      config = JSON.parse(configData);
    } catch (error) {
      // If file doesn't exist, create default config
      config = {
        password: '23',
        settings: {
          maxAttempts: 3,
          lockoutTime: 30000
        }
      };
    }

    // Update password
    config.password = password;

    // Write updated config back to file
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'Password updated successfully' 
    });
  } catch (error) {
    console.error('Error updating config:', error);
    return NextResponse.json(
      { error: 'Failed to update configuration' },
      { status: 500 }
    );
  }
}
