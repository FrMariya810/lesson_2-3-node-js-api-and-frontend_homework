# Минимальный .npmrc

В корне этого проекта уже находится [.npmrc](.npmrc):

```ini
fund=false
audit=false
```

fund=false убирает сообщение о финансировании зависимостей. audit=false отключает автоматический аудит при установке; вручную npm audit остаётся доступен. [Описание настроек npm](https://docs.npmjs.com/cli/v10/using-npm/config/).

Настройки не меняют registry, TLS и правила разрешения зависимостей. Требования — Node.js 22.18+ и npm 10+; проверьте node -v и npm -v. При использовании nvm можно выполнить nvm install и nvm use по .nvmrc.

Выполняйте npm ci в этой папке рядом с package.json. Сервер — npm run dev:api, frontend в другом терминале — npm run dev. Проверка типов и сборка — npm run build, просмотр сборки — npm run preview при работающем API.

Не меняйте lockfile и версии зависимостей только ради установки. .npmrc не исправляет несовместимую версию Node.js.
