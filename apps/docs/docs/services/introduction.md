---
id: introduction
title: Service End Points
hide_title: false
tags:
  - Learning
  - Services
---

## Services

The Broadridge-FXL client <-> server communication is driven by various service end points. These end points are described by .yaml documents written in the [OpenAPI Spec v3.0.0](https://swagger.io/specification/).

:::note

These .yaml documents can either be updating manually or using a [GUI editor](https://stoplight.io/).

:::

## Service End Points

|             API Hives             |       Solution        | Project                            | File                  |
| :-------------------------------: | :-------------------: | :--------------------------------- | :-------------------- |
|      [Base](/services/base)       |      TwoFourCore      | TwoFour.Trading.CashManagement.WCF | AjaxService.cs        |
|   [Trading](/services/trading)    |    TwoFourTrading     | TwoFour.Trading.WCF                | TradingAjaxService.cs |
| [Cash Management](/services/cash) | TwoFourCashManagement | TwoFour.WCF.Utility.Server         | CashAjaxService.cs    |
