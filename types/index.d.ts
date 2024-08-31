import React, { ReactNode } from 'react';
import {
    Page,
    AppBreadcrumbProps,
    Breadcrumb,
    BreadcrumbItem,
    ColorScheme,
    MenuProps,
    MenuModel,
    LayoutConfig,
    LayoutState,
    LayoutContextProps,
    MailContextProps,
    MenuContextProps,
    ChatContextProps,
    TaskContextProps,
    AppConfigProps,
    NodeRef,
    AppTopbarRef,
    AppMenuItemProps,
    UseSubmenuOverlayPositionProps
} from './layout';
import type { Demo, LayoutType, SortOrderType, CustomEvent, ChartDataState, ChartOptionsState, AppMailSidebarItem, AppMailReplyProps, AppMailProps, MailKeys } from './demo';

import type { NoArgFn, CommonFn, TwoArgsFn } from './booking';
import type { ApiProps, GetType, PostType, PutType } from './booking';
import type { DelType, QueryObjsType, SendObjType, PostWithTimoutType } from './booking';
import type { ApiErrInfo, ApiErrHandler, ApiDataOpts } from './booking';
import { ShowMsgType, ShowErrorMsgType } from './booking';

type ChildContainerProps = {
    children: ReactNode;
};

export type {
    Page,
    AppBreadcrumbProps,
    Breadcrumb,
    BreadcrumbItem,
    ColorScheme,
    MenuProps,
    MenuModel,
    MailKeys,
    LayoutConfig,
    LayoutState,
    LayoutContextProps,
    MailContextProps,
    MenuContextProps,
    ChatContextProps,
    TaskContextProps,
    AppConfigProps,
    NodeRef,
    AppTopbarRef,
    AppMenuItemProps,
    UseSubmenuOverlayPositionProps,
    ChildContainerProps,
    Demo,
    LayoutType,
    SortOrderType,
    CustomEvent,
    ChartDataState,
    ChartOptionsState,
    AppMailSidebarItem,
    AppMailReplyProps,
    AppMailProps,
    NoArgFn,
    CommonFn,
    TwoArgsFn,
    ApiProps,
    GetType,
    PostType,
    PutType,
    DelType,
    QueryObjsType,
    SendObjType,
    PostWithTimoutType,
    ShowMsgType,
    ShowErrorMsgType
};
