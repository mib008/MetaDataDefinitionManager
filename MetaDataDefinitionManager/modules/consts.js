module.exports = {
    http_result_success: 'success',
    http_result_error: 'error',
    
    dataDefines: {
        table_dictionary: [
            { originColumn : "id", column: "id" },
            { originColumn : "EXTEND_TABLE_COMMENT", column: "extendTableComment" },
            { originColumn : "SYSTEM_NAME", column: "systemName" },
            { originColumn : "TABLE_COMMENT", column: "tableComment" },
            { originColumn : "TABLE_INNER_TPYE", column: "tableInnerType" },
            { originColumn : "TABLE_NAME", column: "tableName" },
            { originColumn : "TABLE_SCHEMA", column: "tableSchema" }
        ],
        table_meta_dictionary: [
            { originColumn : "id", column: "id" },
            { originColumn : "ORDINAL_POSITION", column: "position" },
            { originColumn : "EXTEND_COLUMN_COMMENT", column: "extendColumnComment" },
            { originColumn : "SYSTEM_NAME", column: "systemName" },
            { originColumn : "COLUMN_NAME", column: "columnName" },
            { originColumn : "COLUMN_COMMENT", column: "columnComment" },
            { originColumn : "TABLE_INNER_TPYE", column: "tableInnerType" },
            { originColumn : "TABLE_NAME", column: "tableName" },
            { originColumn : "TABLE_SCHEMA", column: "tableSchema" }
        ],
        idb_account: [
            { originColumn : "ID", column: "id" },
            { originColumn : "USERNAME", column: "userName" },
            { originColumn : "PASSWORD", column: "userPwd" },
            { originColumn : "COMPANY_ID", column: "companyId" },
            { originColumn : "IS_FORBIDDEN", column: "isForbidden" }
        ]
    }
};

