{
  description = "Node direnv";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs = {
    self,
    nixpkgs,
  }:

  let
    system = "x86_64-linux";
    pkgs = import nixpkgs {
      inherit system;
      config = {allowUnfree = true;};
    };
    nodejs = pkgs.nodejs;

  in {
    devShell.${system} = pkgs.mkShell {
      buildInputs = [
        nodejs
      ];
      PUPPETEER_EXECUTABLE_PATH = "${pkgs.chromium}/bin/chromium";
    };
  };
}
