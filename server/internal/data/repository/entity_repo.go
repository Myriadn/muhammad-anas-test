package repository

import (
	"database/sql"
	"test-muhammad-anas/internal/data/model"

	_ "modernc.org/sqlite"
)

type EntityRepository interface {
	GetAll() ([]model.Entity, error)
	GetByID(id int64) (*model.Entity, error)
	Create(e *model.Entity) error
	Update(e *model.Entity) error
	Delete(id int64) error
}

type entityRepo struct {
	db *sql.DB
}

func NewEntityRepository(db *sql.DB) EntityRepository {
	return &entityRepo{db: db}
}

func (r *entityRepo) GetAll() ([]model.Entity, error) {
	rows, err := r.db.Query(`SELECT id,name,type,status,latitude,longitude,description,created_at,updated_at FROM entities ORDER BY id`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []model.Entity
	for rows.Next() {
		var e model.Entity
		rows.Scan(&e.ID, &e.Name, &e.Type, &e.Status, &e.Latitude, &e.Longitude, &e.Description, &e.CreatedAt, &e.UpdatedAt)
		out = append(out, e)
	}
	return out, nil
}

func (r *entityRepo) GetByID(id int64) (*model.Entity, error) {
	var e model.Entity
	err := r.db.QueryRow(`SELECT id,name,type,status,latitude,longitude,description,created_at,updated_at FROM entities WHERE id=?`, id).
		Scan(&e.ID, &e.Name, &e.Type, &e.Status, &e.Latitude, &e.Longitude, &e.Description, &e.CreatedAt, &e.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &e, nil
}

func (r *entityRepo) Create(e *model.Entity) error {
	res, err := r.db.Exec(`INSERT INTO entities (name,type,status,latitude,longitude,description,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)`,
		e.Name, e.Type, e.Status, e.Latitude, e.Longitude, e.Description, e.CreatedAt, e.UpdatedAt)
	if err != nil {
		return err
	}
	e.ID, _ = res.LastInsertId()
	return nil
}

func (r *entityRepo) Update(e *model.Entity) error {
	res, err := r.db.Exec(`UPDATE entities SET name=?,type=?,status=?,latitude=?,longitude=?,description=?,updated_at=? WHERE id=?`,
		e.Name, e.Type, e.Status, e.Latitude, e.Longitude, e.Description, e.UpdatedAt, e.ID)
	if err != nil {
		return err
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return sql.ErrNoRows
	}
	return nil
}

func (r *entityRepo) Delete(id int64) error {
	res, err := r.db.Exec(`DELETE FROM entities WHERE id=?`, id)
	if err != nil {
		return err
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return sql.ErrNoRows
	}
	return nil
}
