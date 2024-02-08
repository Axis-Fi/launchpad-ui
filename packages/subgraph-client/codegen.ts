import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    schema: 'https://api.studio.thegraph.com/query/65230/axisfi-auctions/0.0.4',
    documents: ['queries/**/*.graphql'],
    generates: {
        './src/generated/': {
            preset: 'client',
            config: {
                strictScalars: true,
                skipTypename: true,
                scalars: {
                    Int: {
                        input: "string",
                        output: "string",
                    },
                    Int8: {
                        input: "string",
                        output: "string",
                    },
                    Float: {
                        input: "string",
                        output: "string",
                    },
                    BigDecimal: {
                        input: "string",
                        output: "string",
                    },
                    BigInt: {
                        input: "string",
                        output: "string",
                    },
                    Bytes: {
                        input: "string",
                        output: "string",
                    },
                }
            }
        }
    }
}

export default config
