import espruino from 'rollup-plugin-espruino';
import {terser} from "rollup-plugin-terser";

const rollupConfig = {
    input: './dist/tsc-compiled/index.js',
    output: {
        file: './dist/bundle.js',
        format: 'cjs',
    },
    external: ['http', 'fecha', 'rxjs', 'rxjs/operators'],
    plugins: [
        terser(),
        espruino(),
    ]
};

export default rollupConfig;
