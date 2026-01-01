import express from "express";
import { ApplicationModule } from "./module";

const bootstrap = () => {
    const app = new ApplicationModule(express());
    app.start();
}

bootstrap();
