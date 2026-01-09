# 🎮 FitGirl Repack Downloader

A beautiful CLI tool to download FitGirl Repacks with ease.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- 🎨 **Beautiful CLI interface** with colored output and progress bars
- 📊 **Real-time progress tracking** with download speed and file size
- ☑️ **Interactive file selection** - choose which files to download
- 📁 **Custom output directory** - downloads to `~/Downloads` by default
- 🔗 **Automatic link resolution** - handles nested download links
- ⚡ **Fast and efficient** - built with modern Node.js

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/fitgirl-game-downloader.git
cd fitgirl-game-downloader

# Install dependencies
yarn install

# Build the project
yarn build
```

## 🚀 Usage

### Interactive Mode

Simply run without arguments to be prompted for the URL:

```bash
yarn dev
```

### Command Line

```bash
# Basic usage
yarn dev <url>

# Example
yarn dev "https://fitgirl-repacks.site/control/"

# With custom output directory
yarn dev "https://fitgirl-repacks.site/control/" -o ./my-games

# Skip prompts and download all files
yarn dev "https://fitgirl-repacks.site/control/" -y
```

### Options

| Option               | Description                                             |
| -------------------- | ------------------------------------------------------- |
| `-o, --output <dir>` | Output directory for downloads (default: `~/Downloads`) |
| `-y, --yes`          | Skip confirmation prompts and download all files        |
| `-v, --version`      | Display version number                                  |
| `-h, --help`         | Display help information                                |

## 📸 Preview

```
  ╔═══════════════════════════════════════════════════════════════╗
  ║                                                               ║
  ║   🎮 FitGirl Repack Downloader                                ║
  ║   v1.0.0                                                      ║
  ║                                                               ║
  ╚═══════════════════════════════════════════════════════════════╝

ℹ Fetching download links from: https://fitgirl-repacks.site/...

✔ Found 41 download link(s)

? Select files to download: (Press <space> to select, <a> to toggle all)
 ◉ Game_Part01.rar
 ◉ Game_Part02.rar
 ◉ Game_Part03.rar
 ...

  📥 Starting downloads...

  ██████████████████████████████ │ 45.2% │ 1.23 GB / 2.73 GB │ 15.42 MB/s
```

## 🛠️ Development

```bash
# Run in development mode
yarn dev

# Build for production
yarn build

# Run built version
yarn start
```

## 📋 Requirements

- Node.js 18+
- Yarn or npm

## 📄 License

MIT License - feel free to use this project however you'd like.

## ⚠️ Disclaimer

This tool is for educational purposes only. Please ensure you have the right to download any content and comply with all applicable laws and terms of service.
