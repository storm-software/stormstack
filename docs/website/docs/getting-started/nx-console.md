---
id: nx-console
title: Nx Console
hide_title: false
tags:
  - learning
  - getting started
---

Once the installation of node modules is complete, the next step is to ensure Nx Console is installed in your Visual Studio Code.

Open Visual Studio Code, and click on the extension button on the left hand menu:

![img](../../static/img/getting-started/vs-code-extension.png)

This should open a list of all of your installed extensions and include a search bar at the top so that new extensions can be installed.

Type `nx console` into this search bar:

![img](../../static/img/getting-started/nx-console-install.png)

Click on the Nx Console item that is returned and select the install option.

:::caution

Please ensure the publisher name of the extension is "nrwl". You should see this name below the description of the extension.

:::

Once the extension is down installing, a small notification should be displayed in the bottom right corner of your Visual Studio Code instance.

Close Visual Studio Code and restart it, so that the extensions can be re-initialized.

You should now see a new icon on the left hand toolbar:

![img](../../static/img/getting-started/nx-console-icon.png)

Clicking this icon should open a large list of Nx commands we can run and the projects for this repository.

Find the `web-app` project and expand the menu item. There should be a `serve` option displayed with a small play button just to the right. Click this button to start the Broadridge FXL application:

![img](../../static/img/getting-started/start-app.png)

You should see a small terminal window open in the bottom pane of Visual Studio Code. Once you see the following, you application should be started:

![img](../../static/img/getting-started/start-web-app.png)

Navigate to [http://localhost:4200/](http://localhost:4200/) to launch the Broadridge FXL application.
