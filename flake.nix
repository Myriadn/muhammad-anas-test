{
  description = "Golang & React";

  inputs = {
    nixpkgs.url = "github:Nixos/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let 
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in 
    {
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          go
          gopls
          gotools
          golangci-lint

          nodejs_22
          pnpm
          typescript-language-server

          sqlite

          air
        ];

        shellHook = ''
          echo "Go Version     : $(go version)"
          echo "Node Version   : $(node -v)"
          echo "SQLite Version : $(sqlite3 --version)"
        '';
      };
    };
}