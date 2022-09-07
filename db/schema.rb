# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_09_07_075629) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "auth_codes", force: :cascade do |t|
    t.string "email", null: false
    t.string "code", limit: 16
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "scene", limit: 64, default: "signIn"
    t.boolean "used", default: false
  end

  create_table "items", force: :cascade do |t|
    t.string "name", limit: 64, null: false
    t.string "note", limit: 128
    t.string "category", limit: 64, default: "expenses"
    t.integer "amount", null: false
    t.bigint "user_id"
    t.bigint "tag_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "date"
    t.index ["tag_id"], name: "index_items_on_tag_id"
    t.index ["user_id"], name: "index_items_on_user_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name", limit: 64
    t.string "emoji", array: true
    t.string "category", limit: 64, default: "expenses"
    t.boolean "deleted", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_tags_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "items", "tags"
  add_foreign_key "items", "users"
  add_foreign_key "tags", "users"
end
