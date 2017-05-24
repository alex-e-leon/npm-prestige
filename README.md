# npm-prestige

Check and report duplicate -> `dependencies@2.0.1` dependencies -> `duplicate@1.0.3` inside your installed npm modules

## Usage
`npm -g i npm-prestige` or 
`yarn global add npm-prestige`

`npm-prestige`

## Summary 

When building large js applications, you sometimes end up with large trees of dependencies.
When different dependencies depend on different versions of the same package your final program/bundle will end up with both versions inside.
Depending on your application, these extra packages may have negative performance implications 
(for example if you're developing js for a web application, it will increase the final bundle size the user needs to download over the wire).

Sometimes it gets worse, as npm and yarn won't always dedupe all versions of a package with the same version
(if there's another version of the package already installed higher up in the dependency tree)
This can lead to the exact same version of a package installed many many times.
_Note that browserify and some other tools match and dedupe based on the code signature for different dependencies and don't have this problem_

Updating your dependencies to all use the same semver range of packages can reduce the final bundle size of your packages.

npm-prestige reports all duplicate dependencies that it finds installed. It uses `npm ls` under the hood, and only reports un-deduped packages.
