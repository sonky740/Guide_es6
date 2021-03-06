<a href="https://code.visualstudio.com/" target="_blank">visual studio code</a>, <a href="https://nodejs.org/ko/" target="_blank">nodejs (프로젝트 버전:17.3.0)</a>, <a href="https://www.npmjs.com/" target="_blank">npm (프로젝트 버전:8.3.0)</a>, <a href="https://gulpjs.com/" target="_blank">gulp 4</a>, <a href="https://webpack.js.org/" target="_blank">webpack 5</a>으로 작업되어 있습니다.

에디터는 아무거나 써도 무방하지만, nodejs는 필수입니다.

<a href="https://sonky740.github.io/Guide_es6/dist/html/"><u>클릭</u></a>하시면 산출물을 볼 수 있습니다.

## 1. 설치

글로벌로 환경변수 와 gulp 명령어를 위한 cross-env, gulp-cli 설치
```
npm i -g cross-env gulp-cli
```

프로젝트 패키지 인스톨
```
npm install
```

husky (commit전에 타입 체크를 위함) 설치
```
npm run prepare
npx husky add .husky/pre-commit "npm run tsc"
```

## 2. 실행
```
npm run dev
```

## 3. 빌드
```
npm run build
```

## 4. 프로젝트 파일 및 폴더 구조

```
프로젝트명
│
├─ .vscode                         // vscode 설정파일입니다.
│
├─ dist                            // gulp, webpack 빌드된 폴더
│
├─ src                             // 실제 작업
│  ├─ _includes                    // html templates
│  │
│  ├─ guide                        // 요소 가이드
│  │
│  ├─ html                         // 본 페이지 HTML
│  │
│  ├─ resources
│  │  ├─ fonts
│  │  ├─ images
│  │  ├─ js
│  │  └─ scss                      // 스타일 작업 전처리기 scss
│  │
│  └─ _work_sheet_.html            // 페이지 리스트 파일
│
├─ .eslintignore                   // eslint 무시파일 설정
│
├─ .eslintrc.json                  // eslint 설정
│
├─ .jsbeautify.json                // html이 빌드되었을 때 beautify 적용
│
├─ gulpfile.js                     // gulp 설정
│
├─ package.json                    // npm package 설정
│
├─ tsconfig.json                   // typescript config 설정
│
└─ webpack.config.js               // webpack 설정
```