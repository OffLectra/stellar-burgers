import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@api$": "<rootDir>/src/utils/burger-api",
    "^@slices/(.*)$": "<rootDir>/src/services/slices/$1",
    "^@selectors$": "<rootDir>/src/services/selectors",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@components$": "<rootDir>/src/components",
    "^@ui/(.*)$": "<rootDir>/src/components/ui/$1",
    "^@ui$": "<rootDir>/src/components/ui",
    "^@ui-pages/(.*)$": "<rootDir>/src/components/ui/pages/$1",
    "^@pages$": "<rootDir>/src/pages",
    "^@pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@utils-types$": "<rootDir>/src/utils/types",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@utils$": "<rootDir>/src/utils",
    "^@images/(.*)$": "<rootDir>/src/images/$1",
    "\\.(css|less|scss)$": "jest-css-modules-transform"
  },
  testMatch: ["**/__tests__/**/*.test.{ts,tsx}"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  }
};

export default config;