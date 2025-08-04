import React from "react";
import useGlobalHook from "use-global-hook";
import * as authenticationActions from './actions/authentication/authentication'
import * as breadcrumbActions from './actions/breadcrumb/breadcrumb'
import * as loaderAction from './actions/Loader/Loader';

const initialState = {
    userSession: null,
    breadcrumb: [],
    loader: 0,
    title: "QRISYS"
};

const useGlobal = useGlobalHook(React, initialState, { ...authenticationActions, ...breadcrumbActions, ...loaderAction });

export default useGlobal;
